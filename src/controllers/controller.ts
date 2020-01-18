import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import ServiceContainer from '../services/service-container';

/**
 * Base controller class.
 * 
 * Controllers are used to create API endpoints and process them.
 * 
 * To create a controller, simply extends this class and register it in the `ControllerService`.
 */
export default abstract class Controller {

    public readonly rootUri: string;
    public readonly router: Router;
    public readonly endpoints: Endpoint[];
    protected readonly container: ServiceContainer;

    /**
     * Creates a new controller.
     * 
     * @param container Services container
     * @param rootUri Root URI
     */
    public constructor(container: ServiceContainer, rootUri: string) {
        this.container = container;
        this.rootUri = rootUri;
        this.router = Router();
        this.endpoints = [];
    }

    /**
     * Registers an endpoint.
     * 
     * @param endpoint Endpoint to register
     */
    protected registerEndpoint(endpoint: Endpoint): void {
        this.endpoints.push(endpoint);
        switch (endpoint.method) {
            default:
            case 'GET':
                this.router.get(endpoint.uri, this.triggerEndpointHandler, endpoint.handlers);
                break;
            case 'POST':
                this.router.post(endpoint.uri, this.triggerEndpointHandler, endpoint.handlers);
                break;
            case 'PUT':
                this.router.put(endpoint.uri, this.triggerEndpointHandler, endpoint.handlers);
                break;
            case 'PATCH':
                this.router.patch(endpoint.uri, this.triggerEndpointHandler, endpoint.handlers);
                break;
            case 'DELETE':
                this.router.delete(endpoint.uri, this.triggerEndpointHandler, endpoint.handlers);
                break;
        }
    }

    /**
     * Logs a message when an endpoint is triggered.
     * 
     * This method is a handler.
     * 
     * @param req Express request
     * @param res Express response
     * @param next Next handler
     * @async
     */
    private async triggerEndpointHandler(req: Request, res: Response, next: NextFunction): Promise<any> {
        console.log(`${req.ip} > ${req.method} ${req.originalUrl}`);
        return next();
    }
}

/**
 * Endpoint interface.
 */
export interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    uri: string;
    handlers: RequestHandler[];
    description?: string;
}