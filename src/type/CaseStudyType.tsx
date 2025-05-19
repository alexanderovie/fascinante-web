// src/type/CaseStudyType.ts

export interface ProjectInfo {
    client: string;
    completedDate: string;
    manager: string;
    location: string;
}

export interface Count {
    label: string;
    value: string;
}

export interface CaseStudyType {
    id: number;
    category: string;
    subTitle: string;
    title: string;
    desc: string;
    shortDesc: string;
    img: string;
    projectInfo: ProjectInfo;
    counts: Count[];
    howWeDidItHeading: string;
    howWeDidItText: string;
    featuresList: string[];
    finalOutcomeHeading: string;
    finalOutcomeDesc: string;
    finalOutcomeImage: string;
}