import 'cdktf/lib/testing/adapters/jest';
import { Entity } from '../../src/entities/base/Entity';
import { Construct } from 'constructs';


/**
 * This is a dummy entity to test the base entity
 * This is needed because the base entity class is abstract
 * We don't need to implement the loadResources method for this test,
 * but the class interface requires it.
 */
class Doppleman extends Entity{


    loadResources({ scope }: { scope: Construct; }): Promise<void> {

        throw new Error('Method not implemented.');

    }


}

describe('Base Entity', () => {

    it('gets the name from the cr properly without external name annotation', () => {

        const doppleman = new Doppleman({

            apiVersion: 'firestartr.dev/v1',

            kind: 'Doppleman',

            metadata: {

                name: 'doppleman',

            }
        });

        expect(doppleman.metadata.name).toEqual('doppleman');

    });


    it('gets the name from the cr properly when it has an external name', () => {

        const doppleman = new Doppleman({

            apiVersion: 'firestartr.dev/v1',

            kind: 'Doppleman',

            metadata: {

                name: 'doppleman',

                annotations: {

                    'firestartr.dev/external-name': 'doppleman-external',

                },

            }
        });

        expect(doppleman.metadata.name).toEqual('doppleman-external');

    });

    it('gets the name of a dep that contains the external-name annotation', () => {

        /**
         * First we create the artifact, which is the CR to be provisioned
         */
        const artifact = {

            apiVersion: 'firestartr.dev/v1',

            kind: 'Doppleman',

            metadata: {

                name: 'doppleman',

            }
        };

        /**
         * Then we create the deps, which are the CRs that the artifact depends on
         */
        const deps = {

            "Doppleman-DOPPLEMAN_NAME": {

                cr: {

                    apiVersion: 'firestartr.dev/v1',

                    kind: 'Doppleman',

                    metadata: {

                        name: 'DOPPLEMAN_NAME',


                        /**
                         * This is the annotation that we are testing, it should be
                         * used to get the name to be used in the provisioned resource
                         */
                        annotations: {

                            'firestartr.dev/external-name': 'DOPPLEMAN_REAL_PROVISION_NAME',

                        },

                    }

                }

            }

        };

        const doppleman = new Doppleman(artifact, deps);

        /**
         * This is the ref that we are testing, it should be resolved to
         * DOPPLEMAN_REAL_PROVISION_NAME
         */
        const ref = {

            kind: 'Doppleman',

            name: 'DOPPLEMAN_NAME',

            needsSecret: false
        }

        expect(

            doppleman.resolveRef(ref)

        )

        .toEqual('DOPPLEMAN_REAL_PROVISION_NAME');

    });

});
