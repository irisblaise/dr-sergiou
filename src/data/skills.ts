import type { Skill } from './types'
import skillNeuro from '../assets/handoff/skill-neuro.png'
import skillCoding from '../assets/handoff/skill-coding.png'
import skillForensic from '../assets/handoff/skill-forensic.png'
import skillVr from '../assets/handoff/skill-vr.png'
import skillBehavior from '../assets/handoff/skill-behavior.png'
import skillMusic from '../assets/handoff/skill-music.png'

// NEW PAGE — the "six passions" as skill domains. One source of truth drives both
// the desktop radial neuron map and the mobile timeline.
// TODO(client): verify the `detail` copy — the prototype text may contain typos /
// placeholder phrasing (e.g. the MUSIC entries). Treat `detail` as client-owned content.
export const skills: Skill[] = [
    {
        key: 'neuro',
        label: 'NEURO',
        image: skillNeuro,
        detail: 'EEG | fMRI | Networks | Neuromodulation',
    },
    {
        key: 'coding',
        label: 'CODING',
        image: skillCoding,
        detail: 'MatLab | EEGlab | Python (beginner)',
    },
    {
        key: 'forensic',
        label: 'FORENSIC',
        image: skillForensic,
        detail: '11 Prisons | 3 TBS | 5 Addiction Clinics',
    },
    {
        key: 'vr',
        label: 'VR',
        image: skillVr,
        detail: 'Virtual Burglary | VR-RTA',
    },
    {
        key: 'behavior',
        label: 'BEHAVIOR',
        image: skillBehavior,
        detail: 'Antisocial | Aggression | Addiction | Criminal Decision-making | Emotion-Regulation | Empathy | Psychopathy',
    },
    {
        key: 'music',
        label: 'MUSIC',
        image: skillMusic,
        detail: 'VentroMedial | Kraft und Licht – Performance manager Milkshake | Der Hintergarten | Manager Subduction',
    },
]

// Section intro copy (shared by both layouts).
export const skillsIntro = {
    heading: 'Skills',
    eyebrow: 'A MAP OF CAPABILITIES',
    paragraph:
        'Combining scientific depth with technical expertise to understand minds, behavior and impact.',
}
