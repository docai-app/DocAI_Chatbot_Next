import Airtable from 'airtable';
Airtable.configure({
    apiKey: process.env.NEXT_PUBLIC_PARAMS_AIRTABLE_KEY
});
const base = Airtable.base('appLD2vnww3WcuOVl');
const table = base('Chain Feature Database');

export async function getAllChainFeatureDatas(ids?: any[]) {
    let fiters = '';
    ids?.forEach((id, index) => {
        fiters += 'id = "' + id + '"';
        if (index !== ids.length - 1) fiters += ',';
    });

    if (ids && ids.length > 0) {
        const records = await table
            ._selectRecords({
                filterByFormula: 'OR(' + fiters + ')',
                sort: [{ field: 'updated_at', direction: 'desc' }]
            })
            .all();
        return records;
    } else {
        return [];
    }
    // else {
    //     const records = await table._selectRecords({ sort: [{ field: 'updated_at', direction: 'desc' }] }).all()
    //     return records;
    // }
}

export async function findChainFeatureById(id: string) {
    if (!id) return null;
    const records = await table.find(id);
    return records;
}

export async function createChainFeature(item: any) {
    const records = await table.create([{ fields: item }]);
    return records;
}

export async function updateChainFeatureById(id: string, item: any) {
    if (!id) return null;
    const records = await table.update([{ id: id, fields: item }]);
    return records;
}

export async function deleteChainFeatureById(id: string) {
    if (!id) return null;
    const records = await table.destroy([id]);
    return records;
}
