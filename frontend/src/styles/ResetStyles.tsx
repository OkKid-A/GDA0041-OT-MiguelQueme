import { createStyles, makeStyles } from "@mui/styles";

const useGlobalStyles = makeStyles(() =>
    createStyles({
        '@global': {
            'html, body': {
                margin: 0,
                padding: 0,
                height: '100%',
                width: '100%',
            },
            '#root': {
                height: '100%',
                width: '100%',
            },
        },
    })
);

const GlobalStyles = () => {
    useGlobalStyles();
    return null;
};

export default GlobalStyles;
