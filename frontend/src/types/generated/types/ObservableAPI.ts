import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
import { ApiError } from '../models/ApiError';
import { AuthResponse } from '../models/AuthResponse';
import { LoginRequest } from '../models/LoginRequest';
import { NewReviewRequest } from '../models/NewReviewRequest';
import { NewThemeRequest } from '../models/NewThemeRequest';
import { NewWritingRequest } from '../models/NewWritingRequest';
import { RegisterRequest } from '../models/RegisterRequest';
import { Theme } from '../models/Theme';
import { User } from '../models/User';
import { Writing } from '../models/Writing';

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class ObservableAuthApi {
    private requestFactory: AuthApiRequestFactory;
    private responseProcessor: AuthApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AuthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AuthApiResponseProcessor();
    }

    /**
     * Get current authenticated user\'s information
     */
    public getCurrentUserWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<User>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getCurrentUser(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCurrentUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get current authenticated user\'s information
     */
    public getCurrentUser(_options?: ConfigurationOptions): Observable<User> {
        return this.getCurrentUserWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<User>) => apiResponse.data));
    }

    /**
     * Authenticate user and get a token
     * @param loginRequest
     */
    public loginUserWithHttpInfo(loginRequest: LoginRequest, _options?: ConfigurationOptions): Observable<HttpInfo<AuthResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.loginUser(loginRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loginUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Authenticate user and get a token
     * @param loginRequest
     */
    public loginUser(loginRequest: LoginRequest, _options?: ConfigurationOptions): Observable<AuthResponse> {
        return this.loginUserWithHttpInfo(loginRequest, _options).pipe(map((apiResponse: HttpInfo<AuthResponse>) => apiResponse.data));
    }

    /**
     * Sign up a new user
     * @param registerRequest
     */
    public signupUserWithHttpInfo(registerRequest: RegisterRequest, _options?: ConfigurationOptions): Observable<HttpInfo<AuthResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.signupUser(registerRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.signupUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Sign up a new user
     * @param registerRequest
     */
    public signupUser(registerRequest: RegisterRequest, _options?: ConfigurationOptions): Observable<AuthResponse> {
        return this.signupUserWithHttpInfo(registerRequest, _options).pipe(map((apiResponse: HttpInfo<AuthResponse>) => apiResponse.data));
    }

}

import { ThemesApiRequestFactory, ThemesApiResponseProcessor} from "../apis/ThemesApi";
export class ObservableThemesApi {
    private requestFactory: ThemesApiRequestFactory;
    private responseProcessor: ThemesApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ThemesApiRequestFactory,
        responseProcessor?: ThemesApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ThemesApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ThemesApiResponseProcessor();
    }

    /**
     * Create a new theme
     * @param newThemeRequest
     */
    public createThemeWithHttpInfo(newThemeRequest: NewThemeRequest, _options?: ConfigurationOptions): Observable<HttpInfo<Theme>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.createTheme(newThemeRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createThemeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create a new theme
     * @param newThemeRequest
     */
    public createTheme(newThemeRequest: NewThemeRequest, _options?: ConfigurationOptions): Observable<Theme> {
        return this.createThemeWithHttpInfo(newThemeRequest, _options).pipe(map((apiResponse: HttpInfo<Theme>) => apiResponse.data));
    }

    /**
     * Get details of a specific theme by ID
     * @param themeId
     */
    public getThemeByIdWithHttpInfo(themeId: number, _options?: ConfigurationOptions): Observable<HttpInfo<Theme>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getThemeById(themeId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getThemeByIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get details of a specific theme by ID
     * @param themeId
     */
    public getThemeById(themeId: number, _options?: ConfigurationOptions): Observable<Theme> {
        return this.getThemeByIdWithHttpInfo(themeId, _options).pipe(map((apiResponse: HttpInfo<Theme>) => apiResponse.data));
    }

    /**
     * Get a list of all available themes
     */
    public listThemesWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<Array<Theme>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listThemes(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listThemesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get a list of all available themes
     */
    public listThemes(_options?: ConfigurationOptions): Observable<Array<Theme>> {
        return this.listThemesWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<Theme>>) => apiResponse.data));
    }

}

import { WritingsApiRequestFactory, WritingsApiResponseProcessor} from "../apis/WritingsApi";
export class ObservableWritingsApi {
    private requestFactory: WritingsApiRequestFactory;
    private responseProcessor: WritingsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WritingsApiRequestFactory,
        responseProcessor?: WritingsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WritingsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WritingsApiResponseProcessor();
    }

    /**
     * Create a new writing record and trigger AI review
     * @param newWritingRequest
     */
    public createWritingWithHttpInfo(newWritingRequest: NewWritingRequest, _options?: ConfigurationOptions): Observable<HttpInfo<Writing>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.createWriting(newWritingRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createWritingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create a new writing record and trigger AI review
     * @param newWritingRequest
     */
    public createWriting(newWritingRequest: NewWritingRequest, _options?: ConfigurationOptions): Observable<Writing> {
        return this.createWritingWithHttpInfo(newWritingRequest, _options).pipe(map((apiResponse: HttpInfo<Writing>) => apiResponse.data));
    }

    /**
     * Get details of a specific writing record by ID
     * @param writingId
     */
    public getWritingByIdWithHttpInfo(writingId: number, _options?: ConfigurationOptions): Observable<HttpInfo<Writing>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getWritingById(writingId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getWritingByIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get details of a specific writing record by ID
     * @param writingId
     */
    public getWritingById(writingId: number, _options?: ConfigurationOptions): Observable<Writing> {
        return this.getWritingByIdWithHttpInfo(writingId, _options).pipe(map((apiResponse: HttpInfo<Writing>) => apiResponse.data));
    }

    /**
     * Get a list of all writings for the authenticated user
     */
    public listUserWritingsWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<Array<Writing>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listUserWritings(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listUserWritingsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get a list of all writings for the authenticated user
     */
    public listUserWritings(_options?: ConfigurationOptions): Observable<Array<Writing>> {
        return this.listUserWritingsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<Writing>>) => apiResponse.data));
    }

    /**
     * Trigger AI review for a writing
     * @param newReviewRequest
     */
    public reviewWritingWithHttpInfo(newReviewRequest: NewReviewRequest, _options?: ConfigurationOptions): Observable<HttpInfo<Writing>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.reviewWriting(newReviewRequest, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.reviewWritingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Trigger AI review for a writing
     * @param newReviewRequest
     */
    public reviewWriting(newReviewRequest: NewReviewRequest, _options?: ConfigurationOptions): Observable<Writing> {
        return this.reviewWritingWithHttpInfo(newReviewRequest, _options).pipe(map((apiResponse: HttpInfo<Writing>) => apiResponse.data));
    }

}
