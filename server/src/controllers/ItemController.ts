import {Request, Response} from 'express';

import knex from '../database/connection';

class ItemController {

    async index(request: Request, response: Response) {
        const items = await knex('item').select('*');

        const serializedItems = items.map(i => {
            return {
                id: i.id,
                title: i.title,
                image_url: `http://192.168.0.109:3333/uploads/${i.image}`
            } 
        })

        return response.json(serializedItems);
    }
}

export default ItemController;