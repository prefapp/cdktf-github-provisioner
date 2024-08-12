import * as resources from  "./src/resources"
import { Resource } from "./src/resources/resource";

export async function runProvisioner(data: {mainCr: any, deps: any}, opts: any) {

    const { mainCr, deps } = data

    const operation = (opts.import && opts.skipPlan) ? 'IMPORT_SKIP_PLAN' : opts.import ? 'IMPORT' : opts.create ? 'CREATE' : opts.update ? 'UPDATE' : opts.delete ? 'DELETE' : 'UNKNOWN'

    const resource: Resource = createInstanceOf(mainCr, operation, deps)

    await resource.run()

    return resource

}


function createInstanceOf(entity: any, op: string, deps: any){

    return new (<any>resources.default)[entity.kind](entity, op, deps)

}
