import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.dirtywork",
  projectId: "6692c1ec00084bee2f6f",
  databaseId: "6692c331002a53437471",
  userCollectionId: "6692c34c001a4697bbc2",
  workoutsCollectionId: "6692c371002f485a15be",
  exercisesCollectionId: "6692c9df0015049dc070",
  postsCollectionId: "669ef2110011259a9a87",
  storageId: "6692cd680039a69dec75",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  workoutsCollectionId,
  storageId,
  exercisesCollectionId,
  postsCollectionId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

// Sign In
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (userId) => {
  console.log("userid" + userId);
  try {
    const result = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllWorkouts = async (userId) => {
  try {
    const workouts = await databases.listDocuments(
      databaseId,
      workoutsCollectionId,
      [Query.equal("creator", userId), Query.orderAsc('$createdAt')]
      
    );
    return workouts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const createWorkout = async (form) => {
  try {
    const newWorkout = databases.createDocument(
      databaseId,
      workoutsCollectionId,
      ID.unique(),
      {
        title: form.title,
        date: form.date,
        creator: form.userId,
        exercises: form.exercises,
      }
    );

    return newWorkout;
  } catch (err) {
    throw new Error(err);
  }
};

export const createExercise = async (form) => {
  try {
    const newExercise = databases.createDocument(
      databaseId,
      exercisesCollectionId,
      form.exerciseId,
      {
        name: form.name,
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight),
      }
    );
    return newExercise;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteExercise = async(exerciseId) => {
  try {
    const result = await databases.deleteDocument(
      databaseId,
      exercisesCollectionId,
      exerciseId
    );
  } catch (err) {
    throw new Error(err);
  }
}

export const deleteWorkout = async (documentId) => {
  try {
    const result = await databases.deleteDocument(
      databaseId,
      workoutsCollectionId,
      documentId
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (err) {
    throw new Error(err);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;
  } catch (err) {
    throw new Error(err);
  }

  return fileUrl;
};
export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (err) {
    throw new Error(err);
  }
};
export const deleteFile = async (fileId) => {
  try{
    const result = storage.deleteFile(storageId, fileId)
  }catch(err){
    throw new Error(err)
  }
}
export const createPost = async (form) => {
  try {
    const [photoUrl, videoUrl] = await Promise.all([
      uploadFile(form.photo, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      postsCollectionId,
      ID.unique(),
      {
        title: form.title,
        photoUrl: photoUrl,
        videoUrl: videoUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (err) {
    throw new Error(err);
  }
};
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, postsCollectionId,  [
      Query.orderDesc('$createdAt'),
  ]);
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const deletePost = async (documentId) => {
  try {
    const result = await databases.deleteDocument(
      databaseId,
      postsCollectionId,
      documentId,
    );
  } catch (err) {
    throw new Error(err);
  }
}