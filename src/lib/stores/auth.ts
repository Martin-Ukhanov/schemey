import { writable } from 'svelte/store';

export const isSignInModalOpen = writable(false);
export const isSignUpModalOpen = writable(false);
export const isSendMagicLinkModalOpen = writable(false);
