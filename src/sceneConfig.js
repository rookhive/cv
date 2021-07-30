import Prologue from './scenes/Prologue'
import About from './scenes/About'
import Skills from './scenes/Skills'
import Reasons from './scenes/Reasons'
import Epilogue from './scenes/Epilogue'

import Prehistory from './subscenes/Prehistory'
import EducationAndExperience from './subscenes/EducationAndExperience'
import NonCommercialExperience from './subscenes/NonCommercialExperience'

export default [
    Prologue,
    {
        scene: About,
        subscenes: [
            Prehistory,
            EducationAndExperience,
            NonCommercialExperience
        ]
    },
    Skills,
    Reasons,
    Epilogue
]