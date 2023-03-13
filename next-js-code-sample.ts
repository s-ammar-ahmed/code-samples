import { FilterStatistics } from "./filterStatistics";

class FilterDataPredicate {
    id: number;
    count: number;
    label: string;
    selected: boolean;
    constructor(object: any) {
        this.id = object["id"];
        this.count = object["count"];
        this.label = object["label"];
        this.selected = object["selected"];
    }
}

class FilterDataRange {
    id: number;
    xAxisValue: number;
    yAxisValue: number;

    constructor(object: any) {
        this.id = object["id"];
        this.xAxisValue = object["xAxisValue"];
        this.yAxisValue = object["yAxisValue"];
    }
}

class FilterData {
    affiliations: FilterDataPredicate[];
    locations: FilterDataPredicate[];
    specialty: FilterDataPredicate[];
    earliestResearchActivity: FilterDataRange[];
    numberOfPublications: FilterDataRange[];
    publicationsFirstAuthor: FilterDataRange[];
    publicationsLastAuthor: FilterDataRange[];
    atLeastOneClinicalTrial: FilterDataPredicate[];
    clinicalTrialsPhases: FilterDataPredicate[];
    atLeastOneNIHGrant: FilterDataPredicate[];
    numberOfNIHGrants: FilterDataRange[];
    valueOfNIHGrants: FilterDataRange[];
    atLeastOneIndustryPayment: FilterDataPredicate[];
    numberOfIndustryPayments: FilterDataRange[];

    constructor(object: any) {
        this.affiliations = object["affiliations"] ?? [];
        this.locations = object["locations"] ?? [];
        this.specialty = object["specialty"] ?? [];
        this.earliestResearchActivity = object["earliestResearchActivity"] ?? [];
        this.numberOfPublications = object["numberOfPublications"] ?? [];
        this.publicationsFirstAuthor = object["publicationsFirstAuthor"] ?? [];
        this.publicationsLastAuthor = object["publicationsLastAuthor"] ?? [];
        this.atLeastOneClinicalTrial = object["atLeastOneClinicalTrial"] ?? [];
        this.clinicalTrialsPhases = object["clinicalTrialsPhases"] ?? [];
        this.atLeastOneNIHGrant = object["atLeastOneNIHGrant"] ?? [];
        this.numberOfNIHGrants = object["numberOfNIHGrants"] ?? [];
        this.valueOfNIHGrants = object["valueOfNIHGrants"] ?? [];
        this.atLeastOneIndustryPayment = object["atLeastOneIndustryPayment"] ?? [];
        this.numberOfIndustryPayments = object["numberOfIndustryPayments"] ?? [];
    }

    static fromFilterStatistics(filterStatistics: FilterStatistics): FilterData {
        const makePredicateFilter = (data, id) =>
            new FilterDataPredicate({
                id: id,
                count: data.count,
                label: data.key,
                selected: false,
            });

        const makeRangeFilter = (data, id) =>
            new FilterDataRange({
                id: id,
                xAxisValue: data.to ?? data.from + 10,
                yAxisValue: data.count,
            });

        const makeClinicalTrialPhaseFilter = (phase) =>
            new FilterDataPredicate({
                id: phase,
                count: filterStatistics[`clinicalTrialsPhase${phase}`][1].count,
                label: `Phase ${phase}`,
                selected: false,
            });

        return new FilterData({
            ...(filterStatistics.organization && {
                affiliations: filterStatistics
                    .organization!.filter((org) => org.key != "None")
                    .map(makePredicateFilter),
            }),
            ...(filterStatistics.location && {
                locations: filterStatistics.location!.map(
                    (loc, i) =>
                        new FilterDataPredicate({
                            id: i,
                            count: loc.count,
                            label: loc.city ? loc.city + ", " + loc.state : loc.state,
                            selected: false,
                        })
                ),
            }),
            ...(filterStatistics.specialty && {
                specialty: filterStatistics.specialty!.map(makePredicateFilter),
            }),
            ...(filterStatistics.earliestResearchActivity && {
                earliestResearchActivity: filterStatistics
                    .earliestResearchActivity!.filter((earliest) => earliest.key > 1999)
                    .map((data, id) => ({
                        id: id,
                        xAxisValue: data.key,
                        yAxisValue: data.count,
                    })),
            }),
            ...(filterStatistics.publications && {
                numberOfPublications: filterStatistics.publications!.map(makeRangeFilter),
            }),
            ...(filterStatistics.publicationsFirstAuthor && {
                publicationsFirstAuthor:
                    filterStatistics.publicationsFirstAuthor!.map(makeRangeFilter),
            }),
            ...(filterStatistics.publicationsLastAuthor && {
                publicationsLastAuthor:
                    filterStatistics.publicationsLastAuthor!.map(makeRangeFilter),
            }),
            ...(filterStatistics.clinicalTrials && {
                atLeastOneClinicalTrial: [
                    new FilterDataPredicate({
                        id: 0,
                        count:
                            filterStatistics.totalKOLs - filterStatistics.clinicalTrials[0].count,
                        label: "At least one clinical trial",
                        selected: false,
                    }),
                ],
                clinicalTrialsPhases: [
                    makeClinicalTrialPhaseFilter(1),
                    makeClinicalTrialPhaseFilter(2),
                    makeClinicalTrialPhaseFilter(3),
                ],
            }),
            ...(filterStatistics.grant && {
                atLeastOneNIHGrant: [
                    new FilterDataPredicate({
                        id: 0,
                        count: filterStatistics.totalKOLs - filterStatistics.grant[0].count,
                        label: "Has received NIH funding",
                        selected: false,
                    }),
                ],
                numberOfNIHGrants: filterStatistics.grant.map(makeRangeFilter),
                valueOfNIHGrants: filterStatistics.grantsFunding.map(makeRangeFilter),
            }),
            ...(filterStatistics.payments && {
                atLeastOneIndustryPayment: [
                    new FilterDataPredicate({
                        id: 0,
                        count: filterStatistics.totalKOLs - filterStatistics.payments[0].count,
                        label: "Has recieved industry payment",
                        selected: false,
                    }),
                ],
                numberOfIndustryPayments: filterStatistics.grant.map(makeRangeFilter),
            }),
        });
    }
}

export { FilterDataPredicate, FilterDataRange, FilterData };
