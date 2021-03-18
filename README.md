## Tiqed

Tiqed provides utility functions for testing.


## Usage

```

    import { tMo run it, qed } from 'tiqed';

    (() => {

        // describe modules
        tMo(testModuleA)

        // add only to run only this module
        tMo.only(testModuleB)

        // run tests
        run();
    })();


    function testModuleA() {

      it('logs this message');

      it('runs this callback', () => {

          qed('test deep equality', {}, {a: 3});

      });

      it.only('only run this', () => {});

    }

    function testModuleB() {}
    

```
