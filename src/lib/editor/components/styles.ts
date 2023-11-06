import {type CSSProperties} from "react";

const styles: Record<string, CSSProperties>={
    wrapper:{
        display: 'flex',
        position: 'relative',
        textAlign: 'initial',
        padding: '8px 0px',
    },
    fullWidth:{
        width: '100%', 
        marginLeft: '10px',
    },
    hide:{
        display: 'none',
    },
    container:{
        whiteSpace: 'pre',
        display: 'inline-block',
        background: 'white',
    }
};

export default  styles;
