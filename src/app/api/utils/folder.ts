import {prisma} from "@/lib/prisma";
import disk from "@/lib/disk";

export async function clearFolder(folderId: string, userId: string) {
    // Recursively delete all sub-folders and files in the folder
    await deleteFolderRecursive(folderId, userId);
}

async function deleteFolderRecursive(folderId: string, userId: string) {
    const subFolders = await prisma.folder.findMany({
        where: {
            parentId: folderId,
            userId: userId,
        },
    });

    // Recursively delete sub-folders and their files
    for (const subFolder of subFolders) {
        await deleteFolderRecursive(subFolder.id, userId);
        const files = await prisma.file.findMany({
            where: {
                folderId: subFolder.id,
                userId: userId,
            }
        });

        await disk.deleteMany(files.map((file) => file.path));

        await prisma.file.deleteMany({
            where: {
                folderId: subFolder.id,
                userId: userId,
            }
        })
    }

    // Delete the current folder
    await prisma.folder.delete({
        where: {
            id: folderId,
        },
    });
}
