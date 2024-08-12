import { runCDKTF } from '../cdktf'
import { terraformApply, terraformDestroy, terraformInit, terraformPlan } from '../terraform'

export class Resource {

  data:any = {}

  output: string = ''

  logFn: Function = (msg: string) => console.log(msg)

  setLogger(fn:Function){

    this.logFn = fn
  }

  constructor(mainCR:any, operation:string, deps:any[] = []){

    this.set('main_artifact', mainCR)

    this.set('operation', operation)

    this.set('deps', deps)

  }

  async run(){

    try{

      await this.preprocess()

      await this.synth()

      await this.runTerraform()

    } catch(err: any){

      throw `error: ${JSON.stringify(err, null, 4)}`

    }

  }

  artifact(){

    return this.get('main_artifact')

  }

  async synth(){

    const isImport = this.get('operation') === 'IMPORT' || this.get('operation') === 'IMPORT_SKIP_PLAN'

    await runCDKTF(this.get('main_artifact'), "synth", this.get('deps'), isImport)

  }

  log(msg:string){

    this.logFn(msg)

  }

  async runTerraform(){

    let output = ''

    output += await terraformInit(this.get('main_artifact'))

    output += await terraformPlan(this.get('main_artifact'))


    if(this.get('operation') === 'CREATE' || this.get('operation') === 'UPDATE'){

      output += await terraformApply(this.get('main_artifact'), false, true)

    } else if(this.get('operation') === 'DELETE'){

      output += await terraformDestroy(this.get('main_artifact'))

    } else if(this.get('operation') === 'IMPORT'){

      output += await terraformApply(this.get('main_artifact'), true, false)

    } else if(this.get('operation') === 'IMPORT_SKIP_PLAN'){

      output += await terraformApply(this.get('main_artifact'), true, true)

    }

    else {

      throw new Error(`unknown operation: ${this.get('operation')}`)

    }

    this.set('output', output)

  }

  async preprocess(){}

  crs(){}

  env(){}

  set(k:string, v:any){

    this.data[k] = v

  }

  get(k:string){

    return this.data[k]

  }

}
