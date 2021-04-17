import React from "react";
import { Spinner } from "grommet";

const Loader = () => {
    const gradient =
        'radial-gradient(circle, rgba(151,251,182,1) 0%, rgba(236,124,248,1) 100%)';

    return (
        <div style={{
            position: 'fixed',
            top: '45%',
            left: '50%'
        }}>
            <Spinner
                background={gradient}
                size="large"
                border={false}
                animation={[
                    // { type: 'rotateRight', duration: 1300 },
                    { type: 'fadeIn', duration: 1300, size: 'large' },
                    { type: 'pulse', duration: 1050, size: 'large' },
                ]}
            />
        </div>
    )

};

export default Loader;
