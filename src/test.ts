import { tMo, run, it } from './util';

export default function() {

  tMo(moduleA)
  tMo(moduleB);

  run();
}


function moduleA() {
  it('works');
}

function moduleB() {
  it('works b');
}
