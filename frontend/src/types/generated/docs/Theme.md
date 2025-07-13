# Theme


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**category** | **string** |  | [default to undefined]
**timeLimitInSeconds** | **number** |  | [default to undefined]
**createdAt** | **string** |  | [readonly] [default to undefined]
**updatedAt** | **string** |  | [readonly] [default to undefined]
**creatorId** | **number** | ID of the user who created the theme. Null for official themes. | [readonly] [default to undefined]
**isFavorited** | **boolean** | Indicates if the current user has favorited this theme. | [readonly] [default to undefined]

## Example

```typescript
import { Theme } from './api';

const instance: Theme = {
    id,
    title,
    description,
    category,
    timeLimitInSeconds,
    createdAt,
    updatedAt,
    creatorId,
    isFavorited,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
