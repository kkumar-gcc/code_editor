/**
 * @jest-environment node
 */
import {createMocks} from 'node-mocks-http';
import {POST, PUT} from '@/app/api/folders/[[...id]]/route';
import {prismaMock} from '../../../../__mocks__/singleton';
import {getToken} from "next-auth/jwt";
import {getTokenMock} from "../../../../__mocks__/auth";

jest.mock('next-auth/jwt');

const folder = {
    id: 1,
    name: 'test',
    userId: 'f0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
    parentId: null,
    createdAt: '2021-08-11T15:00:00.000Z',
    updatedAt: '2021-08-11T15:00:00.000Z',
}

describe('POST /api/folders/[[...id]]', () => {
    it('should create a folder', async () => {
        const {req} = createMocks({
            method: 'POST',
            headers: {
                authorization: 'Bearer l0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
            },
            json: jest.fn().mockResolvedValue({name: 'test'}),
        });

        (getToken as jest.Mock).mockReturnValueOnce(getTokenMock)

        prismaMock.folder.create.mockResolvedValue(folder as any);

        const result = await POST(req, {params: {id: []}});

        expect(result.status).toBe(200);
        expect(await result.json()).toEqual({
            message: 'Folder created!',
            folder: folder,
        });
    });

    it('should return 400 if name is not provided', async () => {
        const {req} = createMocks({
            method: 'POST',
            headers: {
                authorization: 'Bearer l0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
            },
            json: jest.fn().mockResolvedValue({}),
        });
        (getToken as jest.Mock).mockReturnValueOnce(getTokenMock)
        const result = await POST(req, {params: {id: []}});

        expect(result.status).toBe(400);
        expect(await result.json()).toEqual({
            message: 'name is required!',
        });
    });

    it('should return 401 if user is not authenticated', async () => {
        const {req} = createMocks({
            method: 'POST',
            json: jest.fn().mockResolvedValue({name: 'test'}),
        });

        (getToken as jest.Mock).mockReturnValueOnce({})
        const result = await POST(req, {params: {id: []}});

        expect(result.status).toBe(401);
        expect(await result.json()).toEqual({message: "Not authorized!"});
    });
});

describe('PUT /api/folders/[[...id]]', () => {
    it('should update a folder', async () => {
        const {req} = createMocks({
            method: 'PUT',
            headers: {
                authorization: 'Bearer l0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
            },
            json: jest.fn().mockResolvedValue({name: 'test'}),
        });

        (getToken as jest.Mock).mockReturnValue(getTokenMock);
        prismaMock.folder.update.mockResolvedValue(folder as any);

        const result = await PUT(req, {params: {id: '1'}});

        expect(result.status).toBe(200);
        expect(await result.json()).toEqual({
            message: 'Folder updated!',
            folder: folder,
        });
    });

    it('should return 400 if id is not provided', async () => {
        const {req} = createMocks({
            method: 'PUT',
            headers: {
                authorization: 'Bearer l0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
            },
            json: jest.fn().mockResolvedValue({name: 'test'}),
        });

        (getToken as jest.Mock).mockReturnValue(getTokenMock);
        const result = await PUT(req, {params:{id:''}});

        expect(result.status).toBe(400);
        expect(await result.json()).toEqual({
            message: 'id is required!',
        });
    });

    it('should return 400 if name is not provided', async () => {
        const {req} = createMocks({
            method: 'PUT',
            headers: {
                authorization: 'Bearer l0a5c9e0-4f1a-4b5a-9c0a-9e9a4b1a9a9a',
            },
            json: jest.fn().mockResolvedValue({}),
        });

        (getToken as jest.Mock).mockReturnValue(getTokenMock);
        const result = await PUT(req, {params: {id: '1'}});

        expect(result.status).toBe(400);
        expect(await result.json()).toEqual({
            message: 'name is required!',
        });
    })

    it('should return 401 if user is not authenticated', async () => {
        const {req} = createMocks({
            method: 'PUT',
            json: jest.fn().mockResolvedValue({name: 'test'}),
        });

        (getToken as jest.Mock).mockReturnValue(null);
        const result = await PUT(req, {params: {id: '1'}});

        expect(result.status).toBe(401);
        expect(await result.json()).toEqual({
            message: 'Not authorized!',
        });
    });
});