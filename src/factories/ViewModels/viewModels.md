```mermaid
classDiagram
    AbstractBaseViewModel <|-- HeaderViewModel
    AbstractBaseViewModel <|-- DescriptionViewModel
    AbstractBaseViewModel : +bool loading
    AbstractBaseViewModel : +string error
    AbstractBaseViewModel: +get mappingRules ()
    AbstractBaseViewModel: +set mappingRules(mappingRules)
    AbstractBaseViewModel: +updateModel (datasetDTO)
    AbstractBaseViewModel: +get backendJSON()
    AbstractBaseViewModel: +get frontendProperties()
    AbstractBaseViewModel: +get backendProperties()

    class HeaderViewModel{
      +Date created
      +Date modified
      +object[] categoryColor
      +author[] authors
      +Url titleImg
      +number maxTags
      +string metdataState
      MappingRules
    }

    class DescriptionViewModel{
      +number maxTextLength
      MappingRules
    }
