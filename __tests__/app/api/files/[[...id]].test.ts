/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http';
import {POST} from '@/app/api/files/[[...id]]/route';

describe('name', () => {
    it('should return url from environment variables', async () => {
        // const result = await GET();
        // const { name } = await result.json();
        //
        // expect(name).toEqual('krishan');
    });

    it('should return url from environment variables', async () => {
        const { req } = createMocks({
            method: 'POST',
            query: {
                animal: 'dog',
                id: '123',
            },
        });

        const result = await POST(req, { params: { id: ['123'] } });
        const { name } = await result.json();
    });
});