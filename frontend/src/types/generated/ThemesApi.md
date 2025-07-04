# .ThemesApi

All URIs are relative to *http://localhost:8080/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTheme**](ThemesApi.md#createTheme) | **POST** /themes | Create a new theme
[**getThemeById**](ThemesApi.md#getThemeById) | **GET** /themes/{themeId} | Get details of a specific theme by ID
[**listThemes**](ThemesApi.md#listThemes) | **GET** /themes | Get a list of all available themes


# **createTheme**
> Theme createTheme(newThemeRequest)


### Example


```typescript
import { createConfiguration, ThemesApi } from '';
import type { ThemesApiCreateThemeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ThemesApi(configuration);

const request: ThemesApiCreateThemeRequest = {
  
  newThemeRequest: {
    title: "title_example",
    description: "description_example",
    category: "category_example",
  },
};

const data = await apiInstance.createTheme(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newThemeRequest** | **NewThemeRequest**|  |


### Return type

**Theme**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Theme created successfully |  -  |
**400** | Bad Request - Invalid input |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getThemeById**
> Theme getThemeById()


### Example


```typescript
import { createConfiguration, ThemesApi } from '';
import type { ThemesApiGetThemeByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ThemesApi(configuration);

const request: ThemesApiGetThemeByIdRequest = {
  
  themeId: 1,
};

const data = await apiInstance.getThemeById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **themeId** | [**number**] |  | defaults to undefined


### Return type

**Theme**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Theme details |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |
**404** | Not Found - Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listThemes**
> Array<Theme> listThemes()


### Example


```typescript
import { createConfiguration, ThemesApi } from '';

const configuration = createConfiguration();
const apiInstance = new ThemesApi(configuration);

const request = {};

const data = await apiInstance.listThemes(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<Theme>**

### Authorization

[bearerAuth](README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of themes |  -  |
**401** | Unauthorized - Authentication required or invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


