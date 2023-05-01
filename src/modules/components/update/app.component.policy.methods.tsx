import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider,
    FormControl,
    Grid,
    IconButton,
    makeStyles,
    TextField, Tooltip
} from "@material-ui/core";
import React, { useEffect, useState } from "react"
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from "react-i18next";
import {DialogRawMethodProp} from ".";
import {DeleteOutline, SubdirectoryArrowRight} from "@material-ui/icons";

const style = makeStyles({
    buttonRight: {
        float: 'right',
        position: 'relative',
    }
});

export default function MethodDialog(props: DialogRawMethodProp) {
    const { t } = useTranslation();
    const classes = style();
    const { open: isOpen } = props;

    const [open, setOpen] = useState(isOpen);
    const [fields, setFields] = useState<string[]>(() => {
        if (props.initial.required !== null) {
            const array = [];
            for (let i = 0; i < props.initial.required.length; i ++) {
                array.push('ms-${i}');
            }
            return array;
        }
        return ["ms-0"];
    });
    const [required, setRequired] = useState(props.initial.state ? props.initial.required : [""]);
    const [originClass, setOriginClass] = useState(props.initial.state ? props.initial.classes : [""]);
    const [count, setCount] = useState(props.initial.state ? props.initial.count : [0]);
    const [deduct, setDeduct] = useState(props.initial.state ? props.initial.deductPoint : 0);
    const [max_deduct, setMax_deduct] = useState(props.initial.state ? props.initial.maxDeduct : 0);
    const [resMS, setResMS] = useState({
        state: props.initial.state,
        required: props.initial.required,
        count: props.initial.count,
        classes: props.initial.classes,
        deductPoint: props.initial.deductPoint,
        maxDeduct: props.initial.maxDeduct
    });

    const appendFields = () => {
        let element = `ms-${fields.length}`;
        setFields(fields => fields.concat([element]));
    }


    const deleteFields = (index : number) => {
        const _fields = [...fields];
        const _origin = [...originClass];
        const _required = [...required];
        const _count = [...count];

        _fields.splice(index, 1);
        _origin.splice(index, 1);
        _required.splice(index, 1);
        _count.splice(index, 1);

        setFields(_fields);
        setOriginClass(_origin);
        setRequired(_required);
        setCount(_count);
    }


    const handleOpen = () => {
        setOpen(true);
    }


    useEffect(() => {
        if (isOpen)
            handleOpen();

    }, [isOpen]);


    useEffect(() => {
        props.onCreate("methods", resMS);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[resMS]);


    const handleOriginChange = (index : number) => (e : React.ChangeEvent<HTMLInputElement>) => {
        let newArr = [...originClass];
        newArr[index] = e.target.value;
        setOriginClass(newArr);
    }


    const handleRequiredChange = (index : number) => (e : React.ChangeEvent<HTMLInputElement>) => {
        let newArr = [...required];
        newArr[index] = e.target.value;
        setRequired(newArr);
    }


    const handleCountChange = (index : number) => (e : React.ChangeEvent<HTMLInputElement>) => {
        let newArr = [...count];
        newArr[index] = parseInt(e.target.value);
        setCount(newArr);
    }


    const handleClose = () => {
        props.onClose("methods");
        setOpen(false);
    }


    const handleDelete = () => {
        setResMS({
            state: false,
            required: [],
            count: [],
            classes: [],
            deductPoint: 0,
            maxDeduct: 0
        });
        props.onSubmit("methods", false, [], [], [], 0, 0);
        setOpen(false);
    }


    const handleResMS = () => {
        setResMS({
            state: true,
            required: required,
            count: count,
            classes: originClass,
            deductPoint: deduct,
            maxDeduct: max_deduct
        });
        props.onSubmit("methods", true, required, count, originClass, deduct, max_deduct);
        setOpen(false);
    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-ms"
            maxWidth="sm"
            fullWidth={true}
            scroll='paper'
            disableEscapeKeyDown
        >
            <DialogTitle id="form-dialog-ms">
                {t('policy.ms.1')}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    {t('policy.ms.2')}
                    <Button variant="outlined" onClick={() => appendFields()} startIcon={<AddIcon />} className={classes.buttonRight}>
                        {t('add')}
                    </Button>
                </DialogContentText>

                <Grid container spacing={2}>
                    <Grid item>
                        <TextField
                            type="number"
                            defaultValue={deduct}
                            label={t('policy.basic.deduct')}
                            size="small"
                            margin="dense"
                            onChange={e => setDeduct(parseFloat(e.target.value) || deduct)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="number"
                            defaultValue={max_deduct}
                            label={t('policy.basic.max')}
                            size="small"
                            margin="dense"
                            onChange={e => setMax_deduct(parseFloat(e.target.value) || max_deduct)}
                        />
                    </Grid>
                </Grid>

                {fields.map((input, index) => (
                    <>
                        <Grid container spacing={2} key={index} alignItems="center" justify="center">
                            <Grid xs item>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        value={required[index] || ""}
                                        variant="outlined"
                                        id={"ms-" + index}
                                        label={t('policy.ms.method')}
                                        name={"ms-" + index}
                                        className="ms"
                                        multiline
                                        onChange={handleRequiredChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs item>
                                <TextField
                                    type="number"
                                    value={count[index] || ""}
                                    label={t('policy.ms.count')}
                                    size="small"
                                    margin="normal"
                                    onChange={handleCountChange(index)}
                                />
                            </Grid>
                            <Grid xs={1} item>
                                <IconButton size="medium" onClick={() => deleteFields(index)}>
                                    <DeleteOutline />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="center" justify="center">
                            <Tooltip title="필수 사용 메서드가 구현된 클래스">
                                <IconButton>
                                    <SubdirectoryArrowRight />
                                </IconButton>
                            </Tooltip>
                            <Grid xs item>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        value={originClass[index] || ""}
                                        variant="outlined"
                                        id={"or_cs-" + index}
                                        label={t('policy.ms.class')}
                                        name={"or_cs-" + index}
                                        className="or_cs"
                                        multiline
                                        onChange={handleOriginChange(index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Divider />
                        </Grid>
                    </>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {t('closed')}
                </Button>
                {resMS.state &&
                    <Button onClick={handleDelete} color="primary">
                        {t('delete')}
                    </Button>
                }
                <Button onClick={handleResMS} color="primary">
                    {t('submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}