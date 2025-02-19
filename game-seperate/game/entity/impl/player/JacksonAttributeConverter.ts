import { AttributeConverter, AttributeValue, AttributeValueType, EnhancedType } from 'dynamodb-data-types';

import * as Gson from "gson";

export class JacksonAttributeConverter<T> implements AttributeConverter<T> {
    private static gson = Gson.create();
    private clazz: { new(...args: any[]): T };

    constructor(clazz: { new(...args: any[]): T }) {
        this.clazz = clazz;
    }

    transformFrom(input: T): AttributeValue {
        return AttributeValue.builder()
            .s(JacksonAttributeConverter.gson.toJson(input))
            .build();
    }

    transformTo(input: AttributeValue): T {
        return JacksonAttributeConverter.gson.fromJson(input.s(), this.clazz);
    }

    type(): EnhancedType<T> {
        return EnhancedType.of(this.clazz);
    }

    attributeValueType(): AttributeValueType {
        return AttributeValueType.String;
    }
}