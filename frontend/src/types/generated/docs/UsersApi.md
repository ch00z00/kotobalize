# UsersApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteUserAvatar**](#deleteuseravatar) | **DELETE** /users/me/avatar | Delete user\&#39;s avatar|
|[**getAvatarUploadURL**](#getavataruploadurl) | **POST** /users/me/avatar/upload-url | Get a presigned URL for avatar upload|
|[**updateUserAvatar**](#updateuseravatar) | **PUT** /users/me/avatar | Update user\&#39;s avatar URL|

# **deleteUserAvatar**
> User deleteUserAvatar()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.deleteUserAvatar();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**User**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Avatar deleted successfully |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAvatarUploadURL**
> AvatarUploadResponse getAvatarUploadURL(avatarUploadRequest)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    AvatarUploadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let avatarUploadRequest: AvatarUploadRequest; //

const { status, data } = await apiInstance.getAvatarUploadURL(
    avatarUploadRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **avatarUploadRequest** | **AvatarUploadRequest**|  | |


### Return type

**AvatarUploadResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Presigned URL generated successfully |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserAvatar**
> User updateUserAvatar(updateAvatarRequest)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateAvatarRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let updateAvatarRequest: UpdateAvatarRequest; //

const { status, data } = await apiInstance.updateUserAvatar(
    updateAvatarRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAvatarRequest** | **UpdateAvatarRequest**|  | |


### Return type

**User**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Avatar URL updated successfully |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

