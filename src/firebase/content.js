import { deleteField, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config';

const resumeDocRef = doc(db, 'siteContent', 'resume');

export async function getResumeContent() {
  const snapshot = await getDoc(resumeDocRef);

  if (!snapshot.exists()) {
    return {
      resumeUrl: ''
    };
  }

  return snapshot.data();
}

export async function updateResumeContent({ resumeUrl, resumeName = '' }) {
  await setDoc(
    resumeDocRef,
    {
      resumeUrl: resumeUrl.trim(),
      resumeName: resumeName.trim(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function clearResumeContent() {
  await setDoc(
    resumeDocRef,
    {
      resumeUrl: deleteField(),
      resumeName: deleteField(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
