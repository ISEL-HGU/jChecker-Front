import MuiAppBar, { AppBarProps } from '@material-ui/core/AppBar';
import React from "react";


export default function AppBar(children: AppBarProps) {

    return <MuiAppBar style={{alignItems: 'center'}} elevation={0} position="static" {...children} />;
}