import { Col, Row } from '@/components/grid';
import Input from '@/components/input';
import InputNumber from '@/components/input-number/InputNumber';
import List from '@/components/list/List';
import { setThemes } from '@/theme/theme';

setThemes('#71639e');

const __info__ = {
    version: window.__OWL_VERSION__,
    date: window.__BUILD_DATE__
};

export {
    Row,
    Col,
    Input,
    List,
    __info__,
    InputNumber
};
