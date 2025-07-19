import { DynamoPrefix } from "../../../src/domain/constants/dynamo-prefix.enum";
import { Schedule } from "../../../src/domain/entities/schedule.entity";

describe('Schedule', () => {
  const baseProps = {
    scheduleId: 123,
    centerId: 1,
    specialtyId: 2,
    medicId: 3,
    date: new Date('2025-08-20T10:00:00Z'),
  };

  it('should initialize with correct properties', () => {
    const schedule = new Schedule(baseProps);

    expect(schedule.scheduleId).toBe(123);
    expect(schedule.centerId).toBe(1);
    expect(schedule.specialtyId).toBe(2);
    expect(schedule.medicId).toBe(3);
    expect(schedule.date.toISOString()).toBe('2025-08-20T10:00:00.000Z');
  });

  it('should return correct PK', () => {
    const schedule = new Schedule(baseProps);
    expect(schedule.getPK()).toBe(`${DynamoPrefix.SCHEDULE}#123`);
  });

  it('should return correct SK', () => {
    const schedule = new Schedule(baseProps);
    expect(schedule.getSK()).toBe(`${DynamoPrefix.SCHEDULE}#${DynamoPrefix.DETAILS}`);
  });

  it('should serialize to item correctly', () => {
    const schedule = new Schedule(baseProps);
    const item = schedule.toItem();

    expect(item).toEqual({
      PK: `${DynamoPrefix.SCHEDULE}#123`,
      SK: `${DynamoPrefix.SCHEDULE}#${DynamoPrefix.DETAILS}`,
      itemType: DynamoPrefix.SCHEDULE,
      scheduleId: 123,
      centerId: 1,
      specialtyId: 2,
      medicId: 3,
      date: '2025-08-20T10:00:00.000Z',
    });
  });
});
