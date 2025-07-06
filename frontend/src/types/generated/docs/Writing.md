# Writing


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [readonly] [default to undefined]
**userId** | **number** |  | [readonly] [default to undefined]
**themeId** | **number** |  | [default to undefined]
**content** | **string** |  | [default to undefined]
**durationSeconds** | **number** |  | [default to undefined]
**aiScore** | **number** |  | [optional] [default to undefined]
**aiFeedbackOverall** | **string** |  | [optional] [default to undefined]
**aiFeedbackClarity** | **string** |  | [optional] [default to undefined]
**aiFeedbackAccuracy** | **string** |  | [optional] [default to undefined]
**aiFeedbackCompleteness** | **string** |  | [optional] [default to undefined]
**aiFeedbackStructure** | **string** |  | [optional] [default to undefined]
**aiFeedbackConciseness** | **string** |  | [optional] [default to undefined]
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
    aiFeedbackOverall,
    aiFeedbackClarity,
    aiFeedbackAccuracy,
    aiFeedbackCompleteness,
    aiFeedbackStructure,
    aiFeedbackConciseness,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
