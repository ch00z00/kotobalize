import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

import { AuthResponse } from '../models/AuthResponse';
import { LoginRequest } from '../models/LoginRequest';
import { ModelError } from '../models/ModelError';
import { NewReviewRequest } from '../models/NewReviewRequest';
import { NewWritingRequest } from '../models/NewWritingRequest';
import { RegisterRequest } from '../models/RegisterRequest';
import { Theme } from '../models/Theme';
import { User } from '../models/User';
import { Writing } from '../models/Writing';
import { ObservableAuthApi } from './ObservableAPI';

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class PromiseAuthApi {
    private api: ObservableAuthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get current authenticated user\'s information
     */
    public getCurrentUserWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<User>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getCurrentUserWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get current authenticated user\'s information
     */
    public getCurrentUser(_options?: PromiseConfigurationOptions): Promise<User> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getCurrentUser(observableOptions);
        return result.toPromise();
    }

    /**
     * Authenticate user and get a token
     * @param loginRequest
     */
    public loginUserWithHttpInfo(loginRequest: LoginRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AuthResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.loginUserWithHttpInfo(loginRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Authenticate user and get a token
     * @param loginRequest
     */
    public loginUser(loginRequest: LoginRequest, _options?: PromiseConfigurationOptions): Promise<AuthResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.loginUser(loginRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Sign up a new user
     * @param registerRequest
     */
    public signupUserWithHttpInfo(registerRequest: RegisterRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AuthResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.signupUserWithHttpInfo(registerRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Sign up a new user
     * @param registerRequest
     */
    public signupUser(registerRequest: RegisterRequest, _options?: PromiseConfigurationOptions): Promise<AuthResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.signupUser(registerRequest, observableOptions);
        return result.toPromise();
    }


}



import { ObservableThemesApi } from './ObservableAPI';

import { ThemesApiRequestFactory, ThemesApiResponseProcessor} from "../apis/ThemesApi";
export class PromiseThemesApi {
    private api: ObservableThemesApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThemesApiRequestFactory,
        responseProcessor?: ThemesApiResponseProcessor
    ) {
        this.api = new ObservableThemesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get details of a specific theme by ID
     * @param themeId
     */
    public getThemeByIdWithHttpInfo(themeId: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Theme>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getThemeByIdWithHttpInfo(themeId, observableOptions);
        return result.toPromise();
    }

    /**
     * Get details of a specific theme by ID
     * @param themeId
     */
    public getThemeById(themeId: number, _options?: PromiseConfigurationOptions): Promise<Theme> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getThemeById(themeId, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all available themes
     */
    public listThemesWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<Theme>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listThemesWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all available themes
     */
    public listThemes(_options?: PromiseConfigurationOptions): Promise<Array<Theme>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listThemes(observableOptions);
        return result.toPromise();
    }


}



import { ObservableWritingsApi } from './ObservableAPI';

import { WritingsApiRequestFactory, WritingsApiResponseProcessor} from "../apis/WritingsApi";
export class PromiseWritingsApi {
    private api: ObservableWritingsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WritingsApiRequestFactory,
        responseProcessor?: WritingsApiResponseProcessor
    ) {
        this.api = new ObservableWritingsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create a new writing record and trigger AI review
     * @param newWritingRequest
     */
    public createWritingWithHttpInfo(newWritingRequest: NewWritingRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Writing>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.createWritingWithHttpInfo(newWritingRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Create a new writing record and trigger AI review
     * @param newWritingRequest
     */
    public createWriting(newWritingRequest: NewWritingRequest, _options?: PromiseConfigurationOptions): Promise<Writing> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.createWriting(newWritingRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Get details of a specific writing record by ID
     * @param writingId
     */
    public getWritingByIdWithHttpInfo(writingId: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Writing>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getWritingByIdWithHttpInfo(writingId, observableOptions);
        return result.toPromise();
    }

    /**
     * Get details of a specific writing record by ID
     * @param writingId
     */
    public getWritingById(writingId: number, _options?: PromiseConfigurationOptions): Promise<Writing> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getWritingById(writingId, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all writings for the authenticated user
     */
    public listUserWritingsWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<Writing>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUserWritingsWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get a list of all writings for the authenticated user
     */
    public listUserWritings(_options?: PromiseConfigurationOptions): Promise<Array<Writing>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUserWritings(observableOptions);
        return result.toPromise();
    }

    /**
     * Trigger AI review for a writing
     * @param newReviewRequest
     */
    public reviewWritingWithHttpInfo(newReviewRequest: NewReviewRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Writing>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.reviewWritingWithHttpInfo(newReviewRequest, observableOptions);
        return result.toPromise();
    }

    /**
     * Trigger AI review for a writing
     * @param newReviewRequest
     */
    public reviewWriting(newReviewRequest: NewReviewRequest, _options?: PromiseConfigurationOptions): Promise<Writing> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.reviewWriting(newReviewRequest, observableOptions);
        return result.toPromise();
    }


}



