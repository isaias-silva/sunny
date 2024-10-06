import { Client } from "../src/Client";

jest.mock('../src/Client');

describe('Client', () => {
    let client: jest.Mocked<Client>;
    beforeEach(() => {
        client = new Client() as jest.Mocked<Client>
    })
    test('should connect', async () => {
        client.connect.mockResolvedValue(true)
        const connection = await client.connect()
        
        expect(connection).toBe(true)
        expect(client.connect).toHaveBeenCalled()
    })
    
})