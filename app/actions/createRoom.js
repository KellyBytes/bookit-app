'use server';
import { createAdminClient } from '@/config/appwrite';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import checkAuth from './checkAuth';

async function createRoom(prevState, formData) {
  // Get databases instance
  const { databases, storage } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: 'You must be logged in to create a room',
      };
    }

    // Upload image
    let imageID;

    const image = formData.get('image');

    if (image && image.size > 0 && image.name !== 'undefined') {
      try {
        // Upload image to storage
        const response = await storage.createFile('rooms', ID.unique(), image);
        // imageID to be stored in database
        imageID = response.$id;
      } catch (err) {
        console.log('Error uploading image: ', err);
        return {
          error: 'Error uploading image',
        };
      }
    } else {
      console.log('No image file procided or file is invalid');
    }

    // Create room
    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get('name'),
        description: formData.get('description'),
        sqft: formData.get('sqft'),
        capacity: formData.get('capacity'),
        price_per_hour: formData.get('price_per_hour'),
        address: formData.get('address'),
        location: formData.get('location'),
        availability: formData.get('availability'),
        amenities: formData.get('amenities'),
        image: imageID,
      },
    );

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    const errorMessage =
      err.response.message || 'An unexpected error has occurred';
    return {
      error: errorMessage,
    };
  }
}

export default createRoom;
