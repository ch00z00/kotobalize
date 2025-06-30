# .AuthApi

All URIs are relative to *http://localhost:8080/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCurrentUser**](AuthApi.md#getCurrentUser) | **GET** /auth/me | Get current authenticated user\&#39;s information
[**loginUser**](AuthApi.md#loginUser) | **POST** /auth/login | Authenticate user and get a token
[**signupUser**](AuthApi.md#signupUser) | **POST** /auth/signup | Sign up a new user


# **getCurrentUser**
> User getCurrentUser()


### Example


```typescript
import { createConfiguration, AuthApi } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request = {};

const data = await apiInstance.getCurrentUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**User**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Current user information |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **loginUser**
> AuthResponse loginUser(loginRequest)


### Example


```typescript
import { createConfiguration, AuthApi } from '';
import type { AuthApiLoginUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request: AuthApiLoginUserRequest = {
  
  loginRequest: {
    email: "email_example",
    password: "password_example",
  },
};

const data = await apiInstance.loginUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRequest** | **LoginRequest**|  |


### Return type

**AuthResponse**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User logged in successfully |  -  |
**400** | Bad Request - Invalid input |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **signupUser**
> AuthResponse signupUser(registerRequest)


### Example


```typescript
import { createConfiguration, AuthApi } from '';
import type { AuthApiSignupUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request: AuthApiSignupUserRequest = {
  
  registerRequest: {
    email: "email_example",
    password: "password_example",
  },
};

const data = await apiInstance.signupUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerRequest** | **RegisterRequest**|  |


### Return type

**AuthResponse**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | User registered successfully |  -  |
**400** | Bad Request - Invalid input |  -  |
**409** | User with this email already exists |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


