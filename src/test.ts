import { tMo, run, it, qed } from './util';

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

  it.only('handles promise all', () =>
    Promise.all([
      Promise.reject(3),
      Promise.reject(4),
    ].map(_ => _.catch(_ => {
      qed('ok', _, 3)
    }))));

}


function moduleA() {
  it('works');
}

function moduleB() {
  it('works b');
}
