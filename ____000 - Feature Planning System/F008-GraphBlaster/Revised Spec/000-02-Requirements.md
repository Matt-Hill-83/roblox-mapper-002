# GraphBlaster - Requirements

## R1: GUIs

1. ⬛ Data Generation Engine GUI
    1. ⬛ Number of records control
    2. ⬛ Number of Unique values per property control
    3. ⬛ Live data preview table (1 row)
2. ⬛ Structure Layout Engine GUI
    1. ⬛ Placeholder interface for future layout controls
3. ⬛ Data Linking GUI
    1. ⬛ Placeholder interface for link configuration
4. ⬛ Settings GUI
    1. ⬛ Placeholder interface for general settings
5. ⬛ GUI Tabbing System
    1. ⬛ Compact tab list on left side
    2. ⬛ Tab switching closes previous GUI
    3. ⬛ Data Generation Engine as default tab

## R2: Services

1. ⬛ Data Generation Engine Service
    1. ⬛ Generate random JSON data at runtime
    2. ⬛ Write to TypeScript object file
    3. ⬛ Person entity generation
        1. Random property selection (10 unique choices):
            1. firstName
            2. lastName  
            3. country
            4. petType
            5. countryLivesIn (Country reference)
            6. countryBornIn (Country reference)
            7. countryWorksIn (Country reference)
    4. ⬛ Country entity generation
        1. name
        2. isSunny (boolean)
        3. isWarm (boolean)
        4. happiness (1-10)
        5. expensive (1-10)
2. ⬛ Structure Layout Engine Service
    1. ⬛ Generate geometric container structures
    2. ⬛ Position nodes within structures

## R3: Code Structure

1. ⬛ New isolated folder structure (src2)
    1. ⬛ No overlap with existing codebase
    2. ⬛ Follow existing best practices
    3. ⬛ Organized folder hierarchy
2. ⬛ Sample validation code
    1. ⬛ game.service calls rubixCubeMaker
    2. ⬛ rubixCubeMaker calls cubeMaker
    3. ⬛ cubeMaker calls blockMaker
    4. ⬛ blockMaker calls labelMaker