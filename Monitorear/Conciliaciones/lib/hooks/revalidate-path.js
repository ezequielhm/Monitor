'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateClientPath(path) {
  try {
    await revalidatePath(path);
    console.log(`Path ${path} revalidated successfully.`);
  } catch (error) {
    console.error('Error revalidating path:', error);
  }
}