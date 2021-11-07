var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ClassScheduleType } from "../../../../entity/types";
import { ArgsType, Field, registerEnumType } from "type-graphql";
registerEnumType(ClassScheduleType, {
    name: "ClassScheduleType",
});
var ClassScheduleArgs = (function () {
    function ClassScheduleArgs() {
    }
    __decorate([
        Field(function () { return ClassScheduleType; }),
        __metadata("design:type", String)
    ], ClassScheduleArgs.prototype, "type", void 0);
    __decorate([
        Field(function () { return String; }),
        __metadata("design:type", String)
    ], ClassScheduleArgs.prototype, "classId", void 0);
    ClassScheduleArgs = __decorate([
        ArgsType()
    ], ClassScheduleArgs);
    return ClassScheduleArgs;
}());
export { ClassScheduleArgs };
//# sourceMappingURL=classSchedule.js.map