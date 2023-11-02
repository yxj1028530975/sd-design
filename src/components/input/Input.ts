import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import ClearableLabeledWrapper from './ClearableLabeledWrapper';
import { getPrefixCls } from '@/components/_util/utils';
import classNames from 'classnames';
import { getInputClassName } from '@/components/input/utils';
import { SizeType } from '@/components/_util/type';
import './style/input.scss';
import useControllableState from '@/hooks/useControllableState';

export interface IInputFocusOptions extends FocusOptions {
    cursor?: 'start' | 'end' | 'all';
}

export function triggerFocus(
    element?: HTMLInputElement | HTMLTextAreaElement | null,
    option?: IInputFocusOptions
): void {
    if (!element) {
        return;
    }

    element.focus(option);

    // Selection content
    const { cursor } = option || {};
    if (cursor) {
        const len = element.value.length;

        switch (cursor) {
            case 'start':
                element.setSelectionRange(0, 0);
                break;

            case 'end':
                element.setSelectionRange(len, len);
                break;

            default:
                element.setSelectionRange(0, len);
        }
    }
}

export type InputProps = {
    className?: string,
    size?: SizeType,
    disabled?: boolean,
    type?: string,  // input自有type
    maxLength?: number,
    allowClear?: boolean;
    bordered?: boolean;
    placeholder?: string;
    showCount?: boolean;
    value?: any;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    onChange?: (event: any) => void;
    onPressEnter?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    slots?: Record<string, any>;
}

type State = {
    focused: boolean;
    count?: string
}

export default class Input<T extends InputProps> extends Component<T> {
    static components = { ClearableLabeledWrapper };

    static template = xml`
<ClearableLabeledWrapper inputType="'input'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="controllableState.state.value"
    handleReset.alike="(e) => this.handleReset(e)" slots="props.slots" count="state.count"
>
    <input 
        t-att-disabled="props.disabled"
        t-att-maxlength="props.maxLength"
        t-att-type="props.type"
        t-att-placeholder="props.placeholder"
        t-att-class="getClasses()"
        t-on-focus.stop="onFocus"
        t-on-blur.stop="onBlur"
        t-ref="input"
        t-on-keydown.stop="handleKeyDown"
        t-on-compositionstart="onCompositionstart"
        t-on-compositionend="onCompositionend"
        t-on-input="onInput"
    />
</ClearableLabeledWrapper>
`;

    inputRef: { el: HTMLInputElement | null } = { el: null };

    static defaultProps = {
        type: 'text',
        bordered: true
    };

    // 区分当前是中文输入还是英文输入的flag
    compositionFlag = false;

    state = useState<State>({
        focused: false,
        count: undefined
    });

    controllableState = useControllableState(this.props, {
        value: ''
    });

    protected getClasses(): string {
        const { size, disabled, bordered, className } = this.props;
        const prefixCls = getPrefixCls('input');
        return classNames(getInputClassName(prefixCls, bordered, size, disabled), className);
    }

    protected onFocus(event: FocusEvent): void {
        const { onFocus } = this.props;
        this.state.focused = true;
        onFocus?.(event);
    }

    protected onBlur(event: FocusEvent): void {
        const { onBlur } = this.props;
        this.state.focused = false;
        onBlur?.(event);
    }

    protected handleKeyDown = (e: KeyboardEvent) => {
        const { onPressEnter, onKeyDown } = this.props;
        if (onPressEnter && e.key.toLowerCase() === 'enter') {
            onPressEnter(e);
        }
        onKeyDown?.(e);
    };

    protected onCompositionstart = (e: Event) => {
        this.compositionFlag = true;
    }

    protected onCompositionend = (e: Event) => {
        this.compositionFlag = false;
        this.onInput(e);
    }

    protected onInput = (e: Event) => {
        if (this.compositionFlag) {
            return;
        }

        // 设置input的value
        const value = (e.target as HTMLInputElement).value;
        this.controllableState.setState({ value });
        this.props.onChange?.(e);
        this.inputRef.el!.value = this.controllableState.state.value;
    }

    /**
     * 清除输入框
     * @param e
     */
    protected handleReset(e: MouseEvent): void {
        this.controllableState.setState({ value: '' });
        triggerFocus(this.inputRef.el);
    };

    setup(): void {
        this.inputRef = useRef('input');

        useEffect(() => {
            this.inputRef.el!.value = this.controllableState.state.value;
            if (this.props.showCount) {
                const value = this.controllableState.state.value;
                this.state.count = this.props.maxLength ? `${value.length}/${this.props.maxLength}` : `${value.length}`;
            }else {
                this.state.count = undefined;
            }
        }, () => [this.props.showCount, this.controllableState.state.value]);
    }
}
