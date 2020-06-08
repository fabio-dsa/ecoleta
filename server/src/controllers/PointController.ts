import {Request, Response} from 'express';
import knex from '../database/connection';

class PointerController {

    async index(request: Request, response: Response) {
        const {city, uf, items} = request.query;

        const parseItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('point')
            .join('point_item', 'point.id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id', parseItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('point.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.109:3333/uploads/${point.image}`
            }
        })
        
        return response.json(serializedPoints);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email, 
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
    
        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: request.file.filename
        }
        
        const points_ids = await trx('point').insert(point).returning('id');
        
        const point_id = points_ids[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            })
    
        await trx('point_item')
            .insert(pointItems)
            .then(async() => {
                await trx.commit();
                return response.status(201).json({
                    id: point_id,
                    ...point
                });
            })
            .catch(async() => {
                await trx.rollback();
                return response.status(400).json({message: 'não foi possível salvar o ponto de coleta'});
            }); 
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('point').where({id}).first();

        const items =  await knex('item')
                                .join('point_item', 'item.id', '=', 'point_item.item_id')
                                .where('point_item.point_id', id)
                                .select('item.title')

        if(!point)
            return response.status(404).json({message : 'Não foi possível encontrar o ponto de coleta'});

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.109:3333/uploads/${point.image}`
        }
        
        return response.json({point: serializedPoint, items});
    }
}

export default PointerController;