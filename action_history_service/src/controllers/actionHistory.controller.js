import { actionHistoryService } from '../services/actionHistory.service.js';
import { validationResult } from 'express-validator';
import { Filter } from './filters/filter.js';

class ActionHistoryController {
    async getActions(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const filterParams = req.query;
            if (!filterParams) {
                throw new Error('filter params not provided');
            }
            const filter = new Filter(filterParams);
            const filterOptions = filter.getFilterOptions();
            const actions = await actionHistoryService.getActions(
                filterOptions,
                filterParams.page,
                filterParams.itemsPerPage
            );
            res.status(200).json(actions);
        } catch (error) {
            next(error);
        }
    }

    async getActionById(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = req.params.id;
            const action = await actionHistoryService.getActionById(id);
            res.status(200).json(action);
        } catch (error) {
            next(error);
        }
    }

    async createAction(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { action, shopId, plu } = req.body;
            const productAction = await actionHistoryService.createAction(action, shopId, plu);
            res.status(201).json(productAction);
        } catch (error) {
            next(error);
        }
    }
}

export const actionHistoryController = new ActionHistoryController();
