# WritingsApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createWriting**](#createwriting) | **POST** /writings | Create a new writing record and trigger AI review|
|[**getWritingById**](#getwritingbyid) | **GET** /writings/{writingId} | Get details of a specific writing record by ID|
|[**listUserWritings**](#listuserwritings) | **GET** /writings | Get a list of all writings for the authenticated user|
|[**reviewWriting**](#reviewwriting) | **POST** /review | Trigger AI review for a writing|

# **createWriting**
> Writing createWriting(newWritingRequest)


### Example

```typescript
import {
    WritingsApi,
    Configuration,
    NewWritingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WritingsApi(configuration);

let newWritingRequest: NewWritingRequest; //

const { status, data } = await apiInstance.createWriting(
    newWritingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **newWritingRequest** | **NewWritingRequest**|  | |


### Return type

**Writing**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Writing record created successfully |  -  |
|**400** | Bad Request - Invalid input |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**404** | Theme not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getWritingById**
> Writing getWritingById()


### Example

```typescript
import {
    WritingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WritingsApi(configuration);

let writingId: number; // (default to undefined)

const { status, data } = await apiInstance.getWritingById(
    writingId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **writingId** | [**number**] |  | defaults to undefined|


### Return type

**Writing**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Writing record details |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**403** | Forbidden - User does not own this writing |  -  |
|**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserWritings**
> Array<Writing> listUserWritings()


### Example

```typescript
import {
    WritingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WritingsApi(configuration);

const { status, data } = await apiInstance.listUserWritings();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Writing>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of user\&#39;s writings |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reviewWriting**
> Writing reviewWriting(newReviewRequest)


### Example

```typescript
import {
    WritingsApi,
    Configuration,
    NewReviewRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WritingsApi(configuration);

let newReviewRequest: NewReviewRequest; //

const { status, data } = await apiInstance.reviewWriting(
    newReviewRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **newReviewRequest** | **NewReviewRequest**|  | |


### Return type

**Writing**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | AI review completed successfully |  -  |
|**400** | Bad Request - Invalid input |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**403** | Forbidden - User does not own this writing |  -  |
|**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

