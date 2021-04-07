import { pdeepeq, deepeq } from './util2';

interface Test {
  msg: string,
  fn: () => Promise<any> | void | string | undefined,
  err? : string,
  fail?: string,
  pending?: true
}

function testFailed(t: Test) {
  console.log(`❌ ${t.msg} ${t.fail}`);
}

function testThrowed(t: Test) {
  console.log(`💀 ${t.msg} ${t.err}`);
}

function testBegin(t: Test) {
  console.log(`${t.msg}`);
}

type TMoCase = () => void

type TMo = {
  (): TMoCase,
  only: () => void
}

let tmos: Array<TMoCase> = [],
onlytmos: Array<TMoCase> = [];

let onlyset: Test[] = [];
let stset: Test[] = [];

export function run() {
  let _tmos = onlytmos.length > 0 ? onlytmos : tmos;

  _tmos.forEach(_ => _());

  runtests();
}

export const tMo = (() => {

  let res: any = (fn: TMoCase) => {
    tmos.push(fn);
  }

  res.only = (fn: TMoCase) => {
    onlytmos.push(fn);
  };

  return res;
})();

export function runtests() {
  let laters: Array<Test> = [];

  function maybeDone() {
    if (!laters.some(_ => _.pending)) {

      let failed = testOnly
        .filter(_ => !!_.fail)
        .map(testFailed)

      let errored = testOnly
        .filter(_ => !!_.err)
        .map(testThrowed);

      console.log(`done ${testOnly.length} / ${failed.length} failed`);
    }
  }
  
  function checkLater(test: Test) {
    test.pending = true;
    laters.push(test);

    let onThen = (res: any) => {

      if (typeof res === 'string') {
        test.fail = res;
      } else if (Array.isArray(res)) {
        let msg = res.find(_ => typeof _ === 'string');
        if (msg) {
          test.fail = msg;
        }
      }
      delete test.pending;

      maybeDone();      
    };

    let onCatch = (err: any) => {
      test.err = `Promise rejected: ${err}`;
      delete test.pending;
      maybeDone();
    }
    return [onThen, onCatch];
  }
  
  let errs = [];

  let testOnly = onlyset.length > 0 ? onlyset : stset ;

  testOnly.forEach(_ => {
    try {
      testBegin(_);
      let msg = _.fn();
      if (msg) {
        if (typeof msg === 'string') {
          _.fail = msg;          
        } else if (msg.then) {
          let [onThen, onCatch] = checkLater(_);
          msg.then(onThen)
            .catch(onCatch);
        }
      }
    } catch (e) {
      _.err = e;
    }
  });
  maybeDone();
}

export function it(msg: string, fn: () => Promise<any> | void | string | undefined = () => {}): void {
  let test: Test = {
    msg,
    fn
  }

  stset.push(test);
}

it.only = (msg: string, fn: () => Promise<any> | void | string | undefined): void => {
  let test: Test = {
    msg,
    fn
  }
  onlyset.push(test);
}

export function jss(o: any, msg?: string): void {
  console.log(JSON.stringify(o), msg);
}

export function cry(msg: string, o?: any) {
  let oS = (typeof o === 'string') ? o : JSON.stringify(o);
  console.log(`❌ ${msg} ` + oS);
}

export function nacc(msg: string, a: any,
                     b: any): void {
  if (a !== b) {
    cry(`${msg} got`, a);
  }
}

export function nac(msg: string, a: any): void {
  if (!a) {
    cry(msg);
  }
}


export function sqed(msg: string, a: any,
                    b: any): boolean {
  if (!deepeq(a, b, true)) {
    cry(`${msg} got`, a);
    return true;
  }
  return false;
}

export function ok(a: any) {
  if (!a) {
    cry(`! ${a}`);
  }
}

export function qed(msg: string, a: any,
                    b?: any): boolean {
  if (!b) {
    if (!a) {
      cry(`! ${msg}`);
    }
    return true;
  }
  if (!deepeq(a, b)) {
    cry(`${msg} got`, a);
    return true;
  }
  return false;
}

export function pqed(msg: string, a: any,
                     b: any): boolean {
  if (!pdeepeq(b, a)) {
    cry(`${msg} got`, a);
    return true;
  }
  return false;
}

export function unf(msg: string, a: any) {
  if (a !== undefined) {
    cry(`${msg} != undefined got`, a);
  }
}
