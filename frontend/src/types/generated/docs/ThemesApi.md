# ThemesApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTheme**](#createtheme) | **POST** /themes | Create a new theme|
|[**deleteTheme**](#deletetheme) | **DELETE** /themes/{themeId} | Delete a theme|
|[**getThemeById**](#getthemebyid) | **GET** /themes/{themeId} | Get details of a specific theme by ID|
|[**listThemes**](#listthemes) | **GET** /themes | Get a list of all available themes|
|[**updateTheme**](#updatetheme) | **PUT** /themes/{themeId} | Update an existing theme|

# **createTheme**
> Theme createTheme(newThemeRequest)


### Example

```typescript
import {
    ThemesApi,
    Configuration,
    NewThemeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ThemesApi(configuration);

let newThemeRequest: NewThemeRequest; //

const { status, data } = await apiInstance.createTheme(
    newThemeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **newThemeRequest** | **NewThemeRequest**|  | |


### Return type

**Theme**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Theme created successfully |  -  |
|**400** | Bad Request - Invalid input |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTheme**
> deleteTheme()


### Example

```typescript
import {
    ThemesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ThemesApi(configuration);

let themeId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTheme(
    themeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **themeId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Theme deleted successfully |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getThemeById**
> Theme getThemeById()


### Example

```typescript
import {
    ThemesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ThemesApi(configuration);

let themeId: number; // (default to undefined)

const { status, data } = await apiInstance.getThemeById(
    themeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **themeId** | [**number**] |  | defaults to undefined|


### Return type

**Theme**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Theme details |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listThemes**
> Array<Theme> listThemes()


### Example

```typescript
import {
    ThemesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ThemesApi(configuration);

const { status, data } = await apiInstance.listThemes();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Theme>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of themes |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTheme**
> Theme updateTheme(updateThemeRequest)


### Example

```typescript
import {
    ThemesApi,
    Configuration,
    UpdateThemeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ThemesApi(configuration);

let themeId: number; // (default to undefined)
let updateThemeRequest: UpdateThemeRequest; //

const { status, data } = await apiInstance.updateTheme(
    themeId,
    updateThemeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateThemeRequest** | **UpdateThemeRequest**|  | |
| **themeId** | [**number**] |  | defaults to undefined|


### Return type

**Theme**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Theme updated successfully |  -  |
|**400** | Bad Request - Invalid input |  -  |
|**401** | Unauthorized - Authentication required or invalid credentials |  -  |
|**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

