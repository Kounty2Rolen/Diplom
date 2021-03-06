import React, { useState } from "react";
import { Button } from "reactstrap";

const ModalExample = (props: any) => {
    const { buttonLabel, className } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button color="danger" onClick={toggle}>
                {buttonLabel}
            </Button>
        </div>
    );
};