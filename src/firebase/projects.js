import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './config';

const projectsCollection = collection(db, 'projects');

const sanitizeProject = (project) => ({
  title: project.title.trim(),
  description: project.description.trim(),
  techStack: project.techStack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  githubLink: project.githubLink.trim(),
  liveLink: project.liveLink.trim(),
  imageUrl: project.imageUrl.trim(),
  featured: Boolean(project.featured),
  accent: project.accent?.trim() || 'sun'
});

export async function getProjects() {
  let snapshot;

  try {
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    snapshot = await getDocs(q);
  } catch (error) {
    snapshot = await getDocs(projectsCollection);
  }

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...projectDoc.data()
  }));
}

export async function createProject(project) {
  const payload = sanitizeProject(project);

  const docRef = await addDoc(projectsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return docRef.id;
}

export async function updateProject(projectId, project) {
  const projectRef = doc(db, 'projects', projectId);

  await updateDoc(projectRef, {
    ...sanitizeProject(project),
    updatedAt: serverTimestamp()
  });
}

export async function deleteProject(projectId) {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
}
