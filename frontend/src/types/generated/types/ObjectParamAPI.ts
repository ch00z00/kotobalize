import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { AuthResponse } from '../models/AuthResponse';
import { LoginRequest } from '../models/LoginRequest';
import { ModelError } from '../models/ModelError';
import { NewReviewRequest } from '../models/NewReviewRequest';
import { NewWritingRequest } from '../models/NewWritingRequest';
import { RegisterRequest } from '../models/RegisterRequest';
import { Theme } from '../models/Theme';
import { User } from '../models/User';
import { Writing } from '../models/Writing';

import { ObservableAuthApi } from "./ObservableAPI";
import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";

export interface AuthApiGetCurrentUserRequest {
}

export interface AuthApiLoginUserRequest {
    /**
     * 
     * @type LoginRequest
     * @memberof AuthApiloginUser
     */
    loginRequest: LoginRequest
}

export interface AuthApiSignupUserRequest {
    /**
     * 
     * @type RegisterRequest
     * @memberof AuthApisignupUser
     */
    registerRequest: RegisterRequest
}

export class ObjectAuthApi {
    private api: ObservableAuthApi

    public constructor(configuration: Configuration, requestFactory?: AuthApiRequestFactory, responseProcessor?: AuthApiResponseProcessor) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get current authenticated user\'s information
     * @param param the request object
     */
    public getCurrentUserWithHttpInfo(param: AuthApiGetCurrentUserRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.getCurrentUserWithHttpInfo( options).toPromise();
    }

    /**
     * Get current authenticated user\'s information
     * @param param the request object
     */
    public getCurrentUser(param: AuthApiGetCurrentUserRequest = {}, options?: ConfigurationOptions): Promise<User> {
        return this.api.getCurrentUser( options).toPromise();
    }

    /**
     * Authenticate user and get a token
     * @param param the request object
     */
    public loginUserWithHttpInfo(param: AuthApiLoginUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<AuthResponse>> {
        return this.api.loginUserWithHttpInfo(param.loginRequest,  options).toPromise();
    }

    /**
     * Authenticate user and get a token
     * @param param the request object
     */
    public loginUser(param: AuthApiLoginUserRequest, options?: ConfigurationOptions): Promise<AuthResponse> {
        return this.api.loginUser(param.loginRequest,  options).toPromise();
    }

    /**
     * Sign up a new user
     * @param param the request object
     */
    public signupUserWithHttpInfo(param: AuthApiSignupUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<AuthResponse>> {
        return this.api.signupUserWithHttpInfo(param.registerRequest,  options).toPromise();
    }

    /**
     * Sign up a new user
     * @param param the request object
     */
    public signupUser(param: AuthApiSignupUserRequest, options?: ConfigurationOptions): Promise<AuthResponse> {
        return this.api.signupUser(param.registerRequest,  options).toPromise();
    }

}

import { ObservableThemesApi } from "./ObservableAPI";
import { ThemesApiRequestFactory, ThemesApiResponseProcessor} from "../apis/ThemesApi";

export interface ThemesApiGetThemeByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type number
     * @memberof ThemesApigetThemeById
     */
    themeId: number
}

export interface ThemesApiListThemesRequest {
}

export class ObjectThemesApi {
    private api: ObservableThemesApi

    public constructor(configuration: Configuration, requestFactory?: ThemesApiRequestFactory, responseProcessor?: ThemesApiResponseProcessor) {
        this.api = new ObservableThemesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get details of a specific theme by ID
     * @param param the request object
     */
    public getThemeByIdWithHttpInfo(param: ThemesApiGetThemeByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Theme>> {
        return this.api.getThemeByIdWithHttpInfo(param.themeId,  options).toPromise();
    }

    /**
     * Get details of a specific theme by ID
     * @param param the request object
     */
    public getThemeById(param: ThemesApiGetThemeByIdRequest, options?: ConfigurationOptions): Promise<Theme> {
        return this.api.getThemeById(param.themeId,  options).toPromise();
    }

    /**
     * Get a list of all available themes
     * @param param the request object
     */
    public listThemesWithHttpInfo(param: ThemesApiListThemesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<Theme>>> {
        return this.api.listThemesWithHttpInfo( options).toPromise();
    }

    /**
     * Get a list of all available themes
     * @param param the request object
     */
    public listThemes(param: ThemesApiListThemesRequest = {}, options?: ConfigurationOptions): Promise<Array<Theme>> {
        return this.api.listThemes( options).toPromise();
    }

}

import { ObservableWritingsApi } from "./ObservableAPI";
import { WritingsApiRequestFactory, WritingsApiResponseProcessor} from "../apis/WritingsApi";

export interface WritingsApiCreateWritingRequest {
    /**
     * 
     * @type NewWritingRequest
     * @memberof WritingsApicreateWriting
     */
    newWritingRequest: NewWritingRequest
}

export interface WritingsApiGetWritingByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type number
     * @memberof WritingsApigetWritingById
     */
    writingId: number
}

export interface WritingsApiListUserWritingsRequest {
}

export interface WritingsApiReviewWritingRequest {
    /**
     * 
     * @type NewReviewRequest
     * @memberof WritingsApireviewWriting
     */
    newReviewRequest: NewReviewRequest
}

export class ObjectWritingsApi {
    private api: ObservableWritingsApi

    public constructor(configuration: Configuration, requestFactory?: WritingsApiRequestFactory, responseProcessor?: WritingsApiResponseProcessor) {
        this.api = new ObservableWritingsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create a new writing record and trigger AI review
     * @param param the request object
     */
    public createWritingWithHttpInfo(param: WritingsApiCreateWritingRequest, options?: ConfigurationOptions): Promise<HttpInfo<Writing>> {
        return this.api.createWritingWithHttpInfo(param.newWritingRequest,  options).toPromise();
    }

    /**
     * Create a new writing record and trigger AI review
     * @param param the request object
     */
    public createWriting(param: WritingsApiCreateWritingRequest, options?: ConfigurationOptions): Promise<Writing> {
        return this.api.createWriting(param.newWritingRequest,  options).toPromise();
    }

    /**
     * Get details of a specific writing record by ID
     * @param param the request object
     */
    public getWritingByIdWithHttpInfo(param: WritingsApiGetWritingByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Writing>> {
        return this.api.getWritingByIdWithHttpInfo(param.writingId,  options).toPromise();
    }

    /**
     * Get details of a specific writing record by ID
     * @param param the request object
     */
    public getWritingById(param: WritingsApiGetWritingByIdRequest, options?: ConfigurationOptions): Promise<Writing> {
        return this.api.getWritingById(param.writingId,  options).toPromise();
    }

    /**
     * Get a list of all writings for the authenticated user
     * @param param the request object
     */
    public listUserWritingsWithHttpInfo(param: WritingsApiListUserWritingsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<Writing>>> {
        return this.api.listUserWritingsWithHttpInfo( options).toPromise();
    }

    /**
     * Get a list of all writings for the authenticated user
     * @param param the request object
     */
    public listUserWritings(param: WritingsApiListUserWritingsRequest = {}, options?: ConfigurationOptions): Promise<Array<Writing>> {
        return this.api.listUserWritings( options).toPromise();
    }

    /**
     * Trigger AI review for a writing
     * @param param the request object
     */
    public reviewWritingWithHttpInfo(param: WritingsApiReviewWritingRequest, options?: ConfigurationOptions): Promise<HttpInfo<Writing>> {
        return this.api.reviewWritingWithHttpInfo(param.newReviewRequest,  options).toPromise();
    }

    /**
     * Trigger AI review for a writing
     * @param param the request object
     */
    public reviewWriting(param: WritingsApiReviewWritingRequest, options?: ConfigurationOptions): Promise<Writing> {
        return this.api.reviewWriting(param.newReviewRequest,  options).toPromise();
    }

}
