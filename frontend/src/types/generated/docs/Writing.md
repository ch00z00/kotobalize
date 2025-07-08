# Writing


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**userId** | **number** |  | [readonly] [default to undefined]
**themeId** | **number** |  | [default to undefined]
**content** | **string** |  | [default to undefined]
**durationSeconds** | **number** |  | [default to undefined]
**aiScore** | **number** | The total score from 0 to 100. | [optional] [default to undefined]
**aiFeedback** | **string** | Detailed feedback from AI based on 5 viewpoints. This will be stored as a JSON string. | [optional] [default to undefined]
**createdAt** | **string** |  | [readonly] [default to undefined]
**updatedAt** | **string** |  | [readonly] [default to undefined]

## Example

```typescript
import { Writing } from './api';

const instance: Writing = {
    id,
    userId,
    themeId,
    content,
    durationSeconds,
    aiScore,
    aiFeedback,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
