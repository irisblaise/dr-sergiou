import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
    ...nextCoreWebVitals,
    {
        rules: {
            'react/no-unescaped-entities': 'off',
            // Resetting local UI state when a selection/id prop changes (Impact.tsx) —
            // valid pattern, not the effect-computing-derived-state case this rule targets.
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
]

export default eslintConfig
