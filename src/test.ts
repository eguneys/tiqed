import { tMo, run, it } from './util';

export default function() {

  tMo(moduleA)
  tMo(moduleB);
  tMo(moduleP);

  run();
}

function moduleP() {
  
  it('handles promise', () => {
    return Promise.resolve();
  });
  
  it('handles error', () => {
    return Promise.resolve('slkdfj');
  });

  it('handles rejection', () => {
    return Promise.reject();
  });

}


function moduleA() {
  it('works');
}

function moduleB() {
  it('works b');
}
