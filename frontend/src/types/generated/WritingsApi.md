# .WritingsApi

All URIs are relative to *http://localhost:8080/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createWriting**](WritingsApi.md#createWriting) | **POST** /writings | Create a new writing record and trigger AI review
[**getWritingById**](WritingsApi.md#getWritingById) | **GET** /writings/{writingId} | Get details of a specific writing record by ID
[**listUserWritings**](WritingsApi.md#listUserWritings) | **GET** /writings | Get a list of all writings for the authenticated user
[**reviewWriting**](WritingsApi.md#reviewWriting) | **POST** /review | Trigger AI review for a writing


# **createWriting**
> Writing createWriting(newWritingRequest)


### Example


```typescript
import { createConfiguration, WritingsApi } from '';
import type { WritingsApiCreateWritingRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WritingsApi(configuration);

const request: WritingsApiCreateWritingRequest = {
  
  newWritingRequest: {
    themeId: 1,
    content: "content_example",
    durationSeconds: 1,
  },
};

const data = await apiInstance.createWriting(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newWritingRequest** | **NewWritingRequest**|  |


### Return type

**Writing**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Writing record created successfully |  -  |
**400** | Bad Request - Invalid input |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |
**404** | Theme not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getWritingById**
> Writing getWritingById()


### Example


```typescript
import { createConfiguration, WritingsApi } from '';
import type { WritingsApiGetWritingByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WritingsApi(configuration);

const request: WritingsApiGetWritingByIdRequest = {
  
  writingId: 1,
};

const data = await apiInstance.getWritingById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **writingId** | [**number**] |  | defaults to undefined


### Return type

**Writing**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Writing record details |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |
**403** | Forbidden - User does not own this writing |  -  |
**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listUserWritings**
> Array<Writing> listUserWritings()


### Example


```typescript
import { createConfiguration, WritingsApi } from '';

const configuration = createConfiguration();
const apiInstance = new WritingsApi(configuration);

const request = {};

const data = await apiInstance.listUserWritings(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<Writing>**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of user\&#39;s writings |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **reviewWriting**
> Writing reviewWriting(newReviewRequest)


### Example


```typescript
import { createConfiguration, WritingsApi } from '';
import type { WritingsApiReviewWritingRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WritingsApi(configuration);

const request: WritingsApiReviewWritingRequest = {
  
  newReviewRequest: {
    writingId: 1,
  },
};

const data = await apiInstance.reviewWriting(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newReviewRequest** | **NewReviewRequest**|  |


### Return type

**Writing**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | AI review completed successfully |  -  |
**400** | Bad Request - Invalid input |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |
**403** | Forbidden - User does not own this writing |  -  |
**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


